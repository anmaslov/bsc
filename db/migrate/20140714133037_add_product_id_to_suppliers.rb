class AddProductIdToSuppliers < ActiveRecord::Migration
  def change
    add_column :suppliers, :product_id, :integer
  end
end
