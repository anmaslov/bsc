json.array!(@supplier_import_informations) do |supplier_import_information|
  json.extract! supplier_import_information, :id, :margin, :first_row, :article_column, :title_column, :quantity_column, :price_column, :supplier_id
  json.url supplier_import_information_url(supplier_import_information, format: :json)
end
