"""Update user schema - remove username, add name

Revision ID: 002
Revises: 001
Create Date: 2024-01-01 00:00:00.000000

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "002"
down_revision = "001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add name column to users table
    op.add_column("users", sa.Column("name", sa.String(), nullable=True))

    # Remove username column and its index
    op.drop_index("ix_users_username", table_name="users")
    op.drop_column("users", "username")


def downgrade() -> None:
    # Add back username column
    op.add_column("users", sa.Column("username", sa.String(), nullable=False))
    op.create_index("ix_users_username", "users", ["username"], unique=True)

    # Remove name column
    op.drop_column("users", "name")
