class AddAttachmentFileToPrices < ActiveRecord::Migration
  def self.up
    change_table :prices do |t|
      t.attachment :file
    end
  end

  def self.down
    remove_attachment :prices, :file
  end
end
