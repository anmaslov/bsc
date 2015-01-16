!class AddCharacterTypeToCharacters < ActiveRecord::Migration
  def change
    add_column :characters, :charecter_type_id, :integer
  end
end
