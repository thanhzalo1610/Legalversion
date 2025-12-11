using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using NpgsqlTypes;

#nullable disable

namespace Cms.Legal.Web.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "address_user",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    title_address = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    regions_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    country_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    state_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    city_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    full_address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    is_set_default = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreateAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdateAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_block = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    user_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("address_user_pkey", x => x.code);
                });

            migrationBuilder.CreateTable(
                name: "associations",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    abbreviation = table.Column<string>(type: "character varying", nullable: true),
                    country_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    country_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    province_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    province_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    address = table.Column<string>(type: "text", nullable: true),
                    contact_email = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    contact_phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    website = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    established_date = table.Column<DateOnly>(type: "date", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    legal_authority = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    status = table.Column<bool>(type: "boolean", nullable: true),
                    active_status = table.Column<int>(type: "integer", nullable: true),
                    active_title = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    create_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    update_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("associations_pkey", x => x.code);
                });

            migrationBuilder.CreateTable(
                name: "category",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    title = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    slug = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    description = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    details = table.Column<string>(type: "text", nullable: true),
                    type_field = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    value_field = table.Column<string>(type: "text", nullable: true),
                    is_show = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    create_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    update_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    type_view = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("category_pkey", x => x.code);
                });

            migrationBuilder.CreateTable(
                name: "chatai",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    role_user = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    nick_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    ip_user = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    device_user = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    app_name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    token = table.Column<string>(type: "text", nullable: true),
                    start_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    end_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    create_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    status = table.Column<bool>(type: "boolean", nullable: true, defaultValue: true),
                    user_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("chatai_pkey", x => x.code);
                });

            migrationBuilder.CreateTable(
                name: "contentchatai",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    logchatai_code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    content_chat = table.Column<string>(type: "text", nullable: true),
                    send_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    receive_chat = table.Column<string>(type: "text", nullable: true),
                    receive_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("contentchatai_pkey", x => x.code);
                });

            migrationBuilder.CreateTable(
                name: "guestactions",
                columns: table => new
                {
                    actionid = table.Column<Guid>(type: "uuid", nullable: false),
                    sessionid = table.Column<Guid>(type: "uuid", nullable: false),
                    guestid = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    actiontype = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    actiondata = table.Column<string>(type: "jsonb", nullable: true),
                    url = table.Column<string>(type: "text", nullable: true),
                    createdat = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("guestactions_pkey", x => x.actionid);
                });

            migrationBuilder.CreateTable(
                name: "guestsessions",
                columns: table => new
                {
                    sessionid = table.Column<Guid>(type: "uuid", nullable: false),
                    guestid = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    firstseenat = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    lastseenat = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ipaddress = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    useragent = table.Column<string>(type: "text", nullable: true),
                    device = table.Column<string>(type: "text", nullable: true),
                    os = table.Column<string>(type: "text", nullable: true),
                    browser = table.Column<string>(type: "text", nullable: true),
                    entryurl = table.Column<string>(type: "text", nullable: true),
                    referrer = table.Column<string>(type: "text", nullable: true),
                    campaign = table.Column<string>(type: "text", nullable: true),
                    medium = table.Column<string>(type: "text", nullable: true),
                    source = table.Column<string>(type: "text", nullable: true),
                    sessionstatus = table.Column<short>(type: "smallint", nullable: true, defaultValue: (short)1)
                },
                constraints: table =>
                {
                    table.PrimaryKey("guestsessions_pkey", x => x.sessionid);
                });

            migrationBuilder.CreateTable(
                name: "lawyer",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    user_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    full_name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    common_name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    email = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    phone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    date_of_birth = table.Column<DateOnly>(type: "date", nullable: true),
                    genner = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: true),
                    registration_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("lawyer_pkey", x => x.code);
                });

            migrationBuilder.CreateTable(
                name: "logchatai",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    chatai_code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    create_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    update_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    block = table.Column<bool>(type: "boolean", nullable: true, defaultValue: true),
                    is_storage = table.Column<bool>(type: "boolean", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("logchatai_pkey", x => x.code);
                });

            migrationBuilder.CreateTable(
                name: "menu",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    create_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    update_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    status = table.Column<bool>(type: "boolean", nullable: true),
                    active_status = table.Column<long>(type: "bigint", nullable: true),
                    title_active = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("menu_pkey", x => x.code);
                });

            migrationBuilder.CreateTable(
                name: "menu_des",
                columns: table => new
                {
                    Code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    menu_code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    title = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    slug = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    type_field = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    value_field = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    type_view = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    create_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    update_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("menu_des_pkey", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "menu_role",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    menu_des_code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    menu_code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    parent_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    other = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    display = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: true),
                    is_view = table.Column<bool>(type: "boolean", nullable: true),
                    is_create = table.Column<bool>(type: "boolean", nullable: true),
                    is_edit = table.Column<bool>(type: "boolean", nullable: true),
                    status = table.Column<bool>(type: "boolean", nullable: true),
                    active_status = table.Column<long>(type: "bigint", nullable: true),
                    title_active = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    create_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    update_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    create_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    update_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    user_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("menu_role_pkey", x => x.code);
                });

            migrationBuilder.CreateTable(
                name: "practice_area_categories",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    category_name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    create_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "now()"),
                    create_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    update_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    update_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("practice_area_categories_pkey", x => x.code);
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    TokenHash = table.Column<string>(type: "text", nullable: false),
                    DeviceId = table.Column<string>(type: "text", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Revoked = table.Column<bool>(type: "boolean", nullable: false),
                    ReplacedByToken = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                });



            migrationBuilder.CreateTable(
                name: "category_lawyer",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    lawyer_code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    category_code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    create_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    update_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("category_lawyer_pkey", x => new { x.code, x.lawyer_code, x.category_code });
                    table.ForeignKey(
                        name: "category_lawyer_category_code_fkey",
                        column: x => x.category_code,
                        principalTable: "category",
                        principalColumn: "code");
                });

            migrationBuilder.CreateTable(
                name: "certificates_lawyer",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    lawyer_code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    title = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    slug = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    issued_by = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    issue_date = table.Column<DateOnly>(type: "date", nullable: true),
                    expiry_date = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("certificates_pkey", x => new { x.code, x.lawyer_code });
                    table.ForeignKey(
                        name: "certificates_lawyer_lawyer_code_fkey",
                        column: x => x.lawyer_code,
                        principalTable: "lawyer",
                        principalColumn: "code");
                });

            migrationBuilder.CreateTable(
                name: "educations_lawyer",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    lawyer_code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    degree = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    institution = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    start_date = table.Column<DateOnly>(type: "date", nullable: true),
                    end_date = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("educations_lawyer_pkey", x => x.code);
                    table.ForeignKey(
                        name: "educations_lawyer_lawyer_code_fkey",
                        column: x => x.lawyer_code,
                        principalTable: "lawyer",
                        principalColumn: "code");
                });

            migrationBuilder.CreateTable(
                name: "experiences_lawyer",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    lawyer_code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    position = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    organization = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    start_date = table.Column<DateOnly>(type: "date", nullable: true),
                    end_date = table.Column<DateOnly>(type: "date", nullable: true),
                    descriptio = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("experiences_lawyer_pkey", x => x.code);
                    table.ForeignKey(
                        name: "experiences_lawyer_lawyer_code_fkey",
                        column: x => x.lawyer_code,
                        principalTable: "lawyer",
                        principalColumn: "code");
                });

            migrationBuilder.CreateTable(
                name: "lawyer_documents",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    lawyer_code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    file_name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    file_type = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    file_path = table.Column<string>(type: "text", nullable: true),
                    create_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    update_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    content_file = table.Column<string>(type: "text", nullable: true),
                    content_vector_file = table.Column<NpgsqlTsVector>(type: "tsvector", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("lawyer_documents_pkey", x => x.code);
                    table.ForeignKey(
                        name: "lawyer_documents_lawyer_code_fkey",
                        column: x => x.lawyer_code,
                        principalTable: "lawyer",
                        principalColumn: "code");
                });

            migrationBuilder.CreateTable(
                name: "practice_areas",
                columns: table => new
                {
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    lawyer_code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    area_name = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    area_name_vector = table.Column<NpgsqlTsVector>(type: "tsvector", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: true, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "now()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("practice_areas_pkey", x => x.code);
                    table.ForeignKey(
                        name: "practice_areas_lawyer_code_fkey",
                        column: x => x.lawyer_code,
                        principalTable: "lawyer",
                        principalColumn: "code");
                });



            migrationBuilder.CreateIndex(
                name: "IX_category_lawyer_category_code",
                table: "category_lawyer",
                column: "category_code");

            migrationBuilder.CreateIndex(
                name: "IX_certificates_lawyer_lawyer_code",
                table: "certificates_lawyer",
                column: "lawyer_code");


            migrationBuilder.CreateIndex(
                name: "IX_educations_lawyer_lawyer_code",
                table: "educations_lawyer",
                column: "lawyer_code");

            migrationBuilder.CreateIndex(
                name: "IX_experiences_lawyer_lawyer_code",
                table: "experiences_lawyer",
                column: "lawyer_code");

            migrationBuilder.CreateIndex(
                name: "IX_lawyer_documents_lawyer_code",
                table: "lawyer_documents",
                column: "lawyer_code");

            migrationBuilder.CreateIndex(
                name: "IX_practice_areas_lawyer_code",
                table: "practice_areas",
                column: "lawyer_code");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_TokenHash",
                table: "RefreshTokens",
                column: "TokenHash");
        }


        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "address_user");

            migrationBuilder.DropTable(
                name: "associations");

            migrationBuilder.DropTable(
                name: "category_lawyer");

            migrationBuilder.DropTable(
                name: "certificates_lawyer");

            migrationBuilder.DropTable(
                name: "chatai");
            migrationBuilder.DropTable(
                name: "contentchatai");

            migrationBuilder.DropTable(
                name: "educations_lawyer");

            migrationBuilder.DropTable(
                name: "experiences_lawyer");

            migrationBuilder.DropTable(
                name: "guestactions");

            migrationBuilder.DropTable(
                name: "guestsessions");

            migrationBuilder.DropTable(
                name: "lawyer_documents");

            migrationBuilder.DropTable(
                name: "logchatai");

            migrationBuilder.DropTable(
                name: "menu");

            migrationBuilder.DropTable(
                name: "menu_des");

            migrationBuilder.DropTable(
                name: "menu_role");

            migrationBuilder.DropTable(
                name: "practice_area_categories");

            migrationBuilder.DropTable(
                name: "practice_areas");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "category");

            migrationBuilder.DropTable(
                name: "lawyer");

        }
    }
}
