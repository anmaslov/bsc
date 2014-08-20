class AddAttachmentFileToMailAttachments < ActiveRecord::Migration
  def self.up
    change_table :mail_attachments do |t|
      t.attachment :file
    end
  end

  def self.down
    drop_attached_file :mail_attachments, :file
  end
end
