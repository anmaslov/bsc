class AddperformedDatetimeToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :performed_datetime, :datetime
  end
end
