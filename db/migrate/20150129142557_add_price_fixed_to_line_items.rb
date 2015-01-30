class AddPriceFixedToLineItems < ActiveRecord::Migration
  def change
    add_column :line_items, :price_fixed, :decimal, precision: 15, scale: 2
  end
end
