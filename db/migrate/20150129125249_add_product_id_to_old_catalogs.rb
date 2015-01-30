class AddProductIdToOldCatalogs < ActiveRecord::Migration
  def change
    add_column :old_catalogs, :product_id, :integer
  end
end
