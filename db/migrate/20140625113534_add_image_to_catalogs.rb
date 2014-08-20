class AddImageToCatalogs < ActiveRecord::Migration
  def self.up
    change_table :catalogs do |t|
      t.has_attached_file :image
    end
  end

  def self.down
    drop_attached_file :catalogs, :image
  end
end