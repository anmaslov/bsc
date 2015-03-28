class AddUpdatedPriceAtToProducts < ActiveRecord::Migration
  def change
    add_column :products, :updated_price_at, :datetime
  end
end
