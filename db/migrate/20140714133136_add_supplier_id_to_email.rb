class AddSupplierIdToEmail < ActiveRecord::Migration
  def change
    add_column :emails, :supplier_id, :integer
  end
end
