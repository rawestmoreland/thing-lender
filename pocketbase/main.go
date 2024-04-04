package main

import (
	"fmt"
	"log"
	"net/mail"
	"os"
	"time"

	// "net/http"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/mailer"

	// "github.com/pocketbase/pocketbase/tools/types"
	// "github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/models"
	// "github.com/pocketbase/pocketbase/models/schema"
	// "github.com/pocketbase/pocketbase/tools/types"
)

func main() {
	app := pocketbase.New()

	// serves static files from the provided public dir (if exists)
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.POST("/remind/email", func(c echo.Context) error {

			admin, _ := c.Get(apis.ContextAdminKey).(*models.Admin)
			record, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)

			log.Println((record))

			var isGuest = admin == nil && record == nil

			// This is a guest or not a registered user
			if isGuest || record == nil {
				return c.JSON(401, map[string]any{"success": false, "message": "Unauthorized"})
			}

			data := apis.RequestInfo(c).Data

			log.Println(data)

			borrower_id, ok := data["borrower_id"]
			if !ok {
				return c.JSON(400, map[string]any{"success": false, "message": "Borrower id is required"})
			}

			thing_id, ok := data["thing_id"]
			if !ok {
				return c.JSON(400, map[string]any{"success": false, "message": "Thing id is required"})
			}

			thing_record, err := app.Dao().FindRecordById("things", thing_id.(string))
			if err != nil {
				return c.JSON(400, map[string]any{"success": false, "message": "Thing not found"})
			}
			lent_thing_record, err := app.Dao().FindFirstRecordByFilter("lent_things", "thing_id = {:thing_id}", dbx.Params{"thing_id": thing_id.(string)})
			if err != nil {
				return c.JSON(400, map[string]any{"success": false, "message": "Thing not lent"})
			}

			last_sent_time := lent_thing_record.GetDateTime("last_reminder_sent").Time()
			last_sent_tomorrow := last_sent_time.Add(24 * time.Hour)

			if last_sent_tomorrow.After(time.Now()) {
				return c.JSON(429, map[string]any{"success": false, "message": "You can only send one email reminder per 24 hours"})
			}

			owner_record, err := app.Dao().FindRecordById("users", thing_record.Get("owner_user_id").(string))
			if err != nil {
				return c.JSON(400, map[string]any{"success": false, "message": "Owner not found"})
			}
			borrower_record, err := app.Dao().FindRecordById("borrowers", borrower_id.(string))
			if err != nil {
				return c.JSON(400, map[string]any{"success": false, "message": "Borrower not found"})
			}



			message := &mailer.Message{
				From: mail.Address{
					Address: app.Settings().Meta.SenderAddress,
					Name: app.Settings().Meta.SenderName,
				},
				To: []mail.Address{{Address: borrower_record.Get("email").(string)}},
				Subject: fmt.Sprintf("Reminder: Return %s to %s", thing_record.Get("name"), owner_record.Get("name")),
				HTML: 	fmt.Sprintf(
					`<table width="100%%" border="0" cellspacing="0" cellpadding="0">
						<tr>
							<td align="center">
								<p>Hi %s!</p>
								<p>It looks like <strong>%s</strong> wants their <strong>%s</strong> back. Can you return it please?</p>
								<p>Thanks!</p>
							</td>
						</tr>
					</table>`,
					borrower_record.Get("name"),
					owner_record.Get("name"),
					thing_record.Get("name"),
				),
			}

			app.NewMailClient().Send(message)

			lent_thing_record.Set("last_reminder_sent", time.Now().UTC())

			if err := app.Dao().SaveRecord(lent_thing_record); err != nil {
				return c.JSON(500, map[string]any{"success": false, "message": "Error saving lent thing record"})
			}

			return c.JSON(200, map[string]bool{"success": true})
		})

		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))
		return nil
	})

	// fires only for "borrowers" collection
	app.OnRecordBeforeCreateRequest("borrowers").Add(func(e *core.RecordCreateEvent) error {
		log.Println(e.HttpContext)
		log.Println(e.Record)
		log.Println(e.UploadedFiles)

		email, ok := e.Record.Get("email").(string)
		if !ok {
			log.Println("Invalid email type")
			return nil
		}

		user, err := app.Dao().FindAuthRecordByEmail("users", email)

		if err != nil {
			log.Println(err)
		}

		if user != nil {
			log.Println(user)
			e.Record.Set("borrower_user_id", user.Get("id"))
			user.Set("is_borrower", true)

			if err := app.Dao().SaveRecord(user); err != nil {
				log.Println(err)
			}
		}

		return nil

	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
