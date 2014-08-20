class AddEmailIdToMailAttachments < ActiveRecord::Migration
  def change
    add_column :mail_attachments, :email_id, :integer
  end
end
