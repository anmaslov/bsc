class AddFilenameToMailAttachments < ActiveRecord::Migration
  def change
    add_column :mail_attachments, :filename, :string
  end
end
