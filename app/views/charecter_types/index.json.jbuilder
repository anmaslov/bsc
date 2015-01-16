json.array!(@charecter_types) do |charecter_type|
  json.extract! charecter_type, :id
  json.url charecter_type_url(charecter_type, format: :json)
end
