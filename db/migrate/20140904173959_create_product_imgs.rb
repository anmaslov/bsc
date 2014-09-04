class CreateProductImgs < ActiveRecord::Migration
  def change
    create_table :product_imgs do |t|
      t.string :name
      t.text :description
      t.integer :product_id

      t.timestamps
    end
  end
end
