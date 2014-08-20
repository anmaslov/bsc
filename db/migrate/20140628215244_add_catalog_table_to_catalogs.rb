class AddCatalogTableToCatalogs < ActiveRecord::Migration
  def change
    add_column :catalogs, :catalog_table, :boolean, :default => false
  end
end
