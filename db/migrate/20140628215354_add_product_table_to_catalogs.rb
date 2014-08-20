class AddProductTableToCatalogs < ActiveRecord::Migration
  def change
    add_column :catalogs, :product_table, :boolean, :default => false
  end
end
