class AddPictureToProductImgs < ActiveRecord::Migration
  def self.up
    change_table :product_imgs do |t|
      t.has_attached_file :picture
    end
  end

  def self.down
    drop_attached_file :product_imgs, :picture
  end
end

