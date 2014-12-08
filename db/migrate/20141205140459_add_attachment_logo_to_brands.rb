class AddAttachmentLogoToBrands < ActiveRecord::Migration
  def self.up
    change_table :brands do |t|
      t.attachment :logo
    end
  end

  def self.down
    remove_attachment :brands, :logo
  end
end
