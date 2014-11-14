class AddAttachmentPdfToDetailings < ActiveRecord::Migration
  def self.up
    change_table :detailings do |t|
      t.attachment :pdf
    end
  end

  def self.down
    remove_attachment :detailings, :pdf
  end
end
