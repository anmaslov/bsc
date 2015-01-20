class CreateOldCatalogs < ActiveRecord::Migration
  def change
    create_table :old_catalogs do |t|
      t.integer :idc
      t.integer :catalog_id

      t.timestamps
    end
  end
end
