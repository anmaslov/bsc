class CreateSliders < ActiveRecord::Migration
  def change
    create_table :sliders do |t|
      t.string :title
      t.string :link
      t.integer :news_id
      t.integer :product_id
      t.integer :catalog_id

      t.timestamps
    end
  end
end
