class AddDetailForIdToProduct < ActiveRecord::Migration
  def change
    add_column :products, :detail_for_id, :integer
  end
end
