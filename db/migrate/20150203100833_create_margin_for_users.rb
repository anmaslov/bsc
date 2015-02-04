class CreateMarginForUsers < ActiveRecord::Migration
  # def change
  #   create_table :margin_for_users do |t|
  #     t.integer :supplier_id
  #     t.integer :user_id
  #     t.decimal12 :margin
  #     t.decimal2 :margin
  #
  #     t.timestamps
  #   end
  # end

  def self.up
    create_table :margin_for_users, :id => false do |t|
      t.references :supplier
      t.references :user
    end
    add_index :margin_for_users, [:supplier_id, :user_id]
    add_index :margin_for_users, :user_id
  end

  def self.down
    drop_table :margin_for_users
  end
end
