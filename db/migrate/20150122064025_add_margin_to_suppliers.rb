class AddMarginToSuppliers < ActiveRecord::Migration
  def change
    add_column :suppliers, :margin, :float, :default => 0
  end
end
