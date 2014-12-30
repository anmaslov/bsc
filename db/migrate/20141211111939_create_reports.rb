class CreateReports < ActiveRecord::Migration
  def change
    create_table :reports do |t|
      t.integer :user_id
      t.integer :product_id
      t.integer :catalog_id
      t.integer :page_id
      t.integer :type_action

      t.timestamps
    end
  end
end
