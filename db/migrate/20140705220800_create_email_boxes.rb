class CreateEmailBoxes < ActiveRecord::Migration
  def change
    create_table :email_boxes do |t|
      t.string :address
      t.text :description

      t.timestamps
    end
  end
end
