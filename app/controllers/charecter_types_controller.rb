class CharecterTypesController < ApplicationController
  before_action :set_charecter_type, only: [:show, :edit, :update, :destroy]

  load_and_authorize_resource except: :create
  skip_authorize_resource :only => [:show, :index] #, :replace_character, :change_type_character


  # GET /charecter_types
  # GET /charecter_types.json
  def index
    @charecter_types = CharecterType.all.order(:name)
  end

  # GET /charecter_types/1
  # GET /charecter_types/1.json
  def show
  end

  # GET /charecter_types/new
  def new
    @charecter_type = CharecterType.new
  end

  # GET /charecter_types/1/edit
  def edit
  end

  # POST /charecter_types
  # POST /charecter_types.json
  def create
    @charecter_type = CharecterType.new(charecter_type_params)

    respond_to do |format|
      if @charecter_type.save
        format.html { redirect_to @charecter_type, notice: 'Charecter type was successfully created.' }
        format.json { render action: 'show', status: :created, location: @charecter_type }
      else
        format.html { render action: 'new' }
        format.json { render json: @charecter_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /charecter_types/1
  # PATCH/PUT /charecter_types/1.json
  def update
    respond_to do |format|
      if @charecter_type.update(charecter_type_params)
        format.html { redirect_to @charecter_type, notice: 'Charecter type was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @charecter_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /charecter_types/1
  # DELETE /charecter_types/1.json
  def destroy
    @charecter_type.destroy
    respond_to do |format|
      format.html { redirect_to charecter_types_url }
      format.json { head :no_content }
    end
  end

  def replace_character
    @old = CharecterType.find(params[:old_id])
    @new = CharecterType.find(params[:new_id])

    if @old.present? and @new.present?
      @old.characters.each do |character|
        character.charecter_type_id = @new.id
        character.save
      end

      oldnew = CharecterType.find(params[:old_id])
      oldnew.destroy

      respond_to do |format|
          format.html { redirect_to @new, notice: 'Characters was successfully updated.' }
          format.json { render json: @new }
      end
    end
  end

  def change_type_character
    @character = CharecterType.find(params[:character_id])

    respond_to do |format|
      if @character.update(:type_filtr => params[:value])
        format.html { redirect_to @character, notice: 'Charecter type was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @character.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_charecter_type
      @charecter_type = CharecterType.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def charecter_type_params
      params[:charecter_type]
    end
end
