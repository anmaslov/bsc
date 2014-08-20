class CreateSuppliers < ActiveRecord::Migration
  def change
    create_table :suppliers do |t|
      t.string :title
      t.string :subject
      t.text :description

      t.timestamps
    end
  end
end
