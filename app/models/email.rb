class Email < ActiveRecord::Base
  belongs_to :email_box
  belongs_to :supplier
  has_many :mail_attachment

  def add_attachment(filename)
    file = File.open(filename)
    current_attachment = mail_attachment.find_by_filename(filename)
    if current_attachment.nil?
      current_attachment = mail_attachment.build(filename: filename)
      current_attachment.save
    end
    current_attachment
  end
end
