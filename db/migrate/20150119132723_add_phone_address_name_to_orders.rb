class AddPhoneAddressNameToOrders < ActiveRecord::Migration
  def self.up
    add_column :users, :phone, :string
    add_column :users, :address, :text
    add_column :users, :name, :string
  end

  def self.down
    remove_column :users, :phone
    remove_column :users, :address
    remove_column :users, :name
  end
end
