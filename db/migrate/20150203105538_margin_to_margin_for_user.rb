class MarginToMarginForUser < ActiveRecord::Migration
  def change
    add_column :margin_for_users, :margin, :float, :default => 0
  end
end
