class AddAttachmentImageToDetailings < ActiveRecord::Migration
  def self.up
    change_table :detailings do |t|
      t.attachment :image
    end
  end

  def self.down
    remove_attachment :detailings, :image
  end
end
