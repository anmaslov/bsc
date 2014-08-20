class AddCatalogIdToProducts < ActiveRecord::Migration
  def change
    add_column :products, :catalog_id, :integer, :default => 0
  end
end
