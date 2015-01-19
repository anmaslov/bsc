class AddCommentDeliveryTypePhoneUserIdToOrders < ActiveRecord::Migration

  def self.up
    add_column :orders, :comment, :text
    add_column :orders, :delivery_type, :string
    add_column :orders, :phone, :string
    add_column :orders, :user_id, :integer

    add_index :orders, :user_id
  end

  def self.down
    remove_column :orders, :comment
    remove_column :orders, :delivery_type
    remove_column :orders, :phone
    remove_column :orders, :user_id

    remove_index :orders, :user_id
  end
end
