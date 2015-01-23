class AddNameOrganizationInNorganizationToUsers < ActiveRecord::Migration
  def change
    add_column :users, :NameOrganization, :string
    add_column :users, :InnOrganization, :integer
  end
end
