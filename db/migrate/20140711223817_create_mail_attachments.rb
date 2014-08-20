class CreateMailAttachments < ActiveRecord::Migration
  def change
    create_table :mail_attachments do |t|

      t.timestamps
    end
  end
end
