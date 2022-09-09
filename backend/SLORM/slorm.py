# this project
from sqlalchemy.dialects.mssql.information_schema import columns

from .db.api import SlobyDB

# types
from _types import TableName, TableColumns, SetValues, Condition, ShowTables

# errors
from .utilities.exceptions import SelectError, InsertError, UpdateError, DeleteError
from typing import List
from .utilities.slorm_detector import SlormDetector

slorm_detector = SlormDetector(logger=True)


class Slorm(SlobyDB):
    """
        Simple ORM class, that can handle every SQL command.
        SlobyDB child.
    """
    def __init__(self):
       super().__init__()

    def select(self, table_name: TableName = "", condition: Condition = "") -> List:

        """
        Args:
            table_name("str"): Name of the table.
            condition: A simple sign(str) or statements, shows what data you need, it works like a filter, if the filter behavior appears in the tables, then you going to get them.
        """

        try:
            with self._conn_singleton() as conn:
                with conn.cursor() as cur:

                    cur.execute("""SELECT {0} FROM {1}""".format(condition, table_name))

                    selected_items = cur.fetchall()
                    return selected_items
        except:
           raise SelectError(condition, table_name)

    def insert(self, table_name: TableName = "", table_columns: TableColumns = None, values: SetValues = None):
        """
        Args:
            table_name: The table(name) where you want to insert something. It also can be a dictionary, that you defined in the SlobyAPI constructor.
            table_columns: These are the sql columns, where you can add something.
            values: It should be the values of the table.
        """

        table_columns = table_columns or []
        values = values or []


        try:
            with self._conn_singleton() as conn:
                with conn.cursor() as cur:
                    if slorm_detector.insert_check(table_name, table_columns, values):
                        # params = (table_name, ', '.join(columns), ", ".join(values))
                        # query = "INSERT INTO %s (%s) VALUES (%s)"
                        # cur.execute(query, params)
                        # cur.execute(
                        #     "INSERT INTO %s (%s) VALUES (%s)", (table_name, ', '.join(columns), ", ".join("%s" * len(values))))
                        cur.execute(
                            "INSERT INTO {0} ({1}) VALUES ({2})".format(
                                table_name, ', '.join(table_columns), ", ".join(["%s"] * len(values))
                            ),
                            values
                        )


        except:
            raise InsertError(table_name=table_name, columns=columns, values=values)
    def update(self, table_name: TableName = "", table_columns: TableColumns = None, set_values: SetValues = None, condition: Condition = ""):
        """
            Args:
                table_name: Name of the table where you want to update something.
                table_columns: The columns that you want to modify.
                set_values: The values that you want to add to the columns.
                condition: A simple sign(str) or statements, shows what data you need, it works like a filter, if the filter behavior appears in the tables, then you going to get them.
        """

        try:
            with self._conn_singleton() as conn:
                with conn.cursor() as cur:
                    pass
                    if slorm_detector.update_check(table_name, table_columns, set_values):
                        columns_values = slorm_detector.build_update_columns_values_connection(table_columns, set_values)
                        # cur.execute(""" UPDATE {0} SET {1} WHERE {2}""".format(table_name, columns, set_values))

                        # cur.execute("""UPDATE {table_name} SET WHERE {condition}}""".format(table_name=table_name, condition=condition))
        except:
            raise UpdateError(table_name, columns, set_values, condition)

    def delete(self, table_name: TableName = "", condition: Condition = ""):
        """
            Args:
                 table_name: Name of the table where you want to delete something.
                 condition: A simple sign(str) or statements, shows what data you need, it works like a filter, if the filter behavior appears in the tables, then you going to get them.
        """

        try:
            with self._conn_singleton() as conn:
                with conn.cursor() as cur:
                    cur.execute("""""")
        except:
            raise DeleteError(table_name, condition)

    def create_table(self,  tables: TableName):
        """
            Args:
                tables: A list with dictionaries, that contain the name of the table and the data of the table.
        """

        pass
