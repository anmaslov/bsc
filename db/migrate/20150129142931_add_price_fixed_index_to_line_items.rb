class AddPriceFixedIndexToLineItems < ActiveRecord::Migration
  def change
    add_index :line_items, [:price_fixed]
  end
end
