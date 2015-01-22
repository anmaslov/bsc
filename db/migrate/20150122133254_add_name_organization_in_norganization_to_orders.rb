class AddNameOrganizationInNorganizationToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :NameOrganization, :string
    add_column :orders, :InnOrganization, :integer
  end
end
