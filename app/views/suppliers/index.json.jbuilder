json.array!(@suppliers) do |supplier|
  json.extract! supplier, :id, :title, :subject, :description
  json.url supplier_url(supplier, format: :json)
end
