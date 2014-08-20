class MailAttachment < ActiveRecord::Base
  belongs_to :email
  #has_attached_file :mail_attachments
end
