json.array!(@email_boxes) do |email_box|
  json.extract! email_box, :id, :address, :description
  json.url email_box_url(email_box, format: :json)
end
