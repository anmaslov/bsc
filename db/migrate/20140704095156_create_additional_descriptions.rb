class CreateAdditionalDescriptions < ActiveRecord::Migration
  def change
    create_table :additional_descriptions do |t|
      t.string :title
      t.text :description

      t.timestamps
    end
  end
end
