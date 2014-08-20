class AddIsActiveToProducts < ActiveRecord::Migration
  def change
    add_column :products, :is_active, :boolean, :default => false
  end
end
