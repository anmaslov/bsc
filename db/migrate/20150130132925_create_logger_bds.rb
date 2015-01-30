class CreateLoggerBds < ActiveRecord::Migration
  def change
    create_table :logger_bds do |t|
      t.string :text

      t.timestamps
    end
  end
end
