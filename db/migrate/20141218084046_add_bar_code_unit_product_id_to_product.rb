class AddBarCodeUnitProductIdToProduct < ActiveRecord::Migration
  def self.up
    add_column :products, :bar_code, :bigint
    add_column :products, :unit, :string
    add_column :products, :product_id, :integer
  end

  def self.down
    remove_column :products, :bar_code
    remove_column :products, :unit
    remove_column :products, :product_id
  end
end