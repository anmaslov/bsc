class CreateDetailings < ActiveRecord::Migration
  def change
    create_table :detailings do |t|
      t.string :title
      t.integer :product_id

      t.timestamps
    end
  end
end
