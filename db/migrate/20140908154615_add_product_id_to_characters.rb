class AddProductIdToCharacters < ActiveRecord::Migration
  def change
    add_column :characters, :product_id, :integer
  end
end
