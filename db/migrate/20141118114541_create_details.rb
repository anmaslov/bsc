class CreateDetails < ActiveRecord::Migration

  def self.up
    create_table :details do |t|
      t.integer :product_id
      t.integer :detail_for_id
      t.string :position_detail

      t.timestamps
    end

    add_index :details, [:product_id, :detail_for_id]
  end

  def self.down
    drop_table :details
  end
end
